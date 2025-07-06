import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Filter, User, Building2, MessageCircle, ArrowRight,
    RefreshCw, Sun, Moon, Download, Loader2, AlertCircle, XCircle,
    Menu, X, ArrowLeft, ChevronDown
} from 'lucide-react';
import adminValidation from '../hookes/adminVerfication';
import api from '../../api';

const AdminMessagesMonitor = () => {
    // State
    adminValidation()
    const [allMessages, setAllMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [darkMode, setDarkMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mobile-specific state
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const messagesEndRef = useRef(null);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowSidebar(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Helper function to group messages into conversations
    const groupMessagesIntoConversations = (messages) => {
        const conversationMap = new Map();

        messages.forEach(message => {
            // Skip self-messages (where sender and receiver are the same)
            if (message.senderId === message.receiverId && message.senderType === message.receiverType) {
                return;
            }

            // Create a unique conversation key based on participants
            const participants = [message.senderId, message.receiverId].sort().join('-');
            const senderTypes = [message.senderType, message.receiverType].sort().join('-');
            const key = `${participants}-${senderTypes}`;

            if (!conversationMap.has(key)) {
                // Determine customer and supplier info
                const isCustomerSender = message.senderType === 'CUSTOMER';
                const customerId = isCustomerSender ? message.senderId : message.receiverId;
                const supplierId = isCustomerSender ? message.receiverId : message.senderId;
                const customerName = isCustomerSender ? message.senderName : message.receiverName;
                const supplierName = isCustomerSender ? message.receiverName : message.senderName;

                conversationMap.set(key, {
                    id: key,
                    customerId,
                    supplierId,
                    customerName,
                    supplierName,
                    messages: [],
                    lastMessage: null,
                    lastMessageTime: null,
                    messageCount: 0,
                    status: 'active' // Default status
                });
            }

            const conversation = conversationMap.get(key);
            conversation.messages.push(message);
            conversation.messageCount++;

            // Update last message info
            if (!conversation.lastMessageTime || new Date(message.createdAt) > new Date(conversation.lastMessageTime)) {
                conversation.lastMessage = message.content;
                conversation.lastMessageTime = message.createdAt;
            }
        });

        // Convert map to array and sort by last message time
        return Array.from(conversationMap.values()).sort((a, b) =>
            new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
    };

    // API Functions
    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${api.defaults.baseURL}/admin/get-conversation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status && data.messagesWithNames) {
                setAllMessages(data.messagesWithNames);
                const groupedConversations = groupMessagesIntoConversations(data.messagesWithNames);
                setConversations(groupedConversations);
            } else {
                setConversations([]);
                setAllMessages([]);
            }

        } catch (error) {
            console.error('Error fetching conversations:', error);
            setError('Failed to load conversations');
            setConversations([]);
            setAllMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const exportConversations = async () => {
        try {
            // Create CSV content from the messages
            const csvHeader = 'ID,Sender ID,Sender Name,Sender Type,Receiver ID,Receiver Name,Receiver Type,Content,Created At\n';
            const csvContent = allMessages.map(msg =>
                `${msg.id},"${msg.senderId}","${msg.senderName}","${msg.senderType}","${msg.receiverId}","${msg.receiverName}","${msg.receiverType}","${msg.content.replace(/"/g, '""')}","${msg.createdAt}"`
            ).join('\n');

            const fullCsv = csvHeader + csvContent;
            const blob = new Blob([fullCsv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `conversations_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error('Error exporting conversations:', error);
            setError('Failed to export conversations');
        }
    };

    // Load conversations on component mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handlers
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        // Sort messages by creation time
        const sortedMessages = [...conversation.messages].sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);

        // Close sidebar on mobile after selection
        if (isMobile) {
            setShowSidebar(false);
        }
    };

    const handleRefresh = () => {
        fetchConversations();
        // If a conversation is selected, update its messages
        if (selectedConversation) {
            const updatedConversation = conversations.find(conv => conv.id === selectedConversation.id);
            if (updatedConversation) {
                handleSelectConversation(updatedConversation);
            }
        }
    };

    const handleBackToList = () => {
        setSelectedConversation(null);
        setMessages([]);
        if (isMobile) {
            setShowSidebar(true);
        }
    };

    // Filter conversations
    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Helper functions
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'No messages';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 'pending': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
            case 'completed': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
            case 'inactive': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
            default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
        }
    };

    // Theme classes
    const themeClasses = {
        bg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
        cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
        border: darkMode ? 'border-gray-700' : 'border-gray-200',
        text: darkMode ? 'text-gray-100' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
        textMuted: darkMode ? 'text-gray-500' : 'text-gray-500',
        hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
        selected: darkMode ? 'bg-blue-900/50' : 'bg-blue-50',
        input: darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
    };

    // Message Bubble Component
    const MessageBubble = ({ message }) => {
        const isCustomer = message.senderType === 'CUSTOMER';

        return (
            <div className={`flex mb-3 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex items-start gap-2 max-w-[85%] sm:max-w-xs lg:max-w-md ${isCustomer ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center flex-shrink-0`}>
                        {isCustomer ? (
                            <User className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textMuted}`} />
                        ) : (
                            <Building2 className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textMuted}`} />
                        )}
                    </div>

                    <div className={`px-3 py-2 rounded-lg ${isCustomer
                        ? `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`
                        : 'bg-blue-500 text-white'
                        }`}>
                        <p className={`text-xs font-medium mb-1 ${isCustomer
                            ? darkMode ? 'text-gray-300' : 'text-gray-600'
                            : 'text-white/70'
                            }`}>
                            {message.senderName}
                        </p>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${isCustomer
                            ? darkMode ? 'text-gray-400' : 'text-gray-600'
                            : 'text-white/70'
                            }`}>
                            {formatTime(message.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Mobile Filter Component
    const MobileFilters = () => (
        <div className={`${showFilters ? 'block' : 'hidden'} p-4 space-y-4 ${themeClasses.cardBg} ${themeClasses.border} border-b md:hidden`}>
            <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`} />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full p-2 ${themeClasses.input} rounded-lg border`}
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>
    );

    // Desktop Sidebar Component
    const DesktopSidebar = () => (
        <div className={`w-96 ${themeClasses.cardBg} ${themeClasses.border} border-r flex flex-col hidden md:flex`}>
            {/* Search and Filters */}
            <div className="p-4 space-y-4">
                <div className="relative">
                    <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full p-2 ${themeClasses.input} rounded-lg border`}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Conversations List */}
            <ConversationsList />
        </div>
    );

    // Mobile Sidebar Component
    const MobileSidebar = () => (
        <>
            {/* Backdrop */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-80 ${themeClasses.cardBg} z-50 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:hidden flex flex-col`}>
                {/* Mobile sidebar header */}
                <div className={`p-4 ${themeClasses.border} border-b flex items-center justify-between`}>
                    <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Conversations</h2>
                    <button
                        onClick={() => setShowSidebar(false)}
                        className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Search and Filters */}
                <div className="p-4 space-y-4">
                    <div className="relative">
                        <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`w-full p-2 ${themeClasses.input} rounded-lg border`}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Conversations List */}
                <ConversationsList />
            </div>
        </>
    );

    // Conversations List Component
    const ConversationsList = () => (
        <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <MessageCircle className={`w-12 h-12 mb-3 ${themeClasses.textMuted}`} />
                    <p className={themeClasses.textMuted}>No conversations found</p>
                </div>
            ) : (
                filteredConversations.map(conv => (
                    <div
                        key={conv.id}
                        className={`p-3 sm:p-4 ${themeClasses.border} border-b ${themeClasses.hover} cursor-pointer transition-colors ${selectedConversation?.id === conv.id ? themeClasses.selected : ''}`}
                        onClick={() => handleSelectConversation(conv)}
                    >
                        <div className="space-y-2 sm:space-y-3">
                            {/* Participants */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                    <span className={`text-xs sm:text-sm font-medium ${themeClasses.text} truncate`}>
                                        {conv.customerName}
                                    </span>
                                </div>
                                <ArrowRight className={`w-3 h-3 ${themeClasses.textMuted} flex-shrink-0 mx-1`} />
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                    <span className={`text-xs sm:text-sm font-medium ${themeClasses.text} truncate`}>
                                        {conv.supplierName}
                                    </span>
                                </div>
                            </div>

                            {/* Status and Message Count */}
                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(conv.status)}`}>
                                    {conv.status?.charAt(0).toUpperCase() + conv.status?.slice(1)}
                                </span>
                                <span className={`text-xs ${themeClasses.textMuted}`}>
                                    {conv.messageCount || 0} messages
                                </span>
                            </div>

                            {/* Last Message */}
                            <div>
                                <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} truncate`}>
                                    {conv.lastMessage || 'No messages yet'}
                                </p>
                                <p className={`text-xs ${themeClasses.textMuted} mt-1`}>
                                    {formatRelativeTime(conv.lastMessageTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className={`min-h-screen ${themeClasses.bg}`}>
            {/* Header */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-b p-4 sm:p-6`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        {isMobile && !selectedConversation && (
                            <button
                                onClick={() => setShowSidebar(true)}
                                className={`p-2 rounded-lg ${themeClasses.hover} transition-colors md:hidden`}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}

                        {/* Mobile back button */}
                        {isMobile && selectedConversation && (
                            <button
                                onClick={handleBackToList}
                                className={`p-2 rounded-lg ${themeClasses.hover} transition-colors md:hidden`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}

                        <div>
                            <h1 className={`text-lg sm:text-2xl font-bold ${themeClasses.text}`}>
                                {isMobile && selectedConversation ? 'Chat' : 'Admin Messages Monitor'}
                            </h1>
                            {(!isMobile || !selectedConversation) && (
                                <p className={`${themeClasses.textSecondary} text-sm sm:text-base hidden sm:block`}>
                                    Monitor conversations between customers and suppliers
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile filter toggle */}
                        {isMobile && !selectedConversation && (
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-lg ${themeClasses.hover} transition-colors md:hidden`}
                            >
                                <Filter className="w-5 h-5" />
                            </button>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-100/50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-red-700 text-sm hidden sm:inline">{error}</span>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={exportConversations}
                            className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                            title="Export Conversations"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Filters */}
            <MobileFilters />

            <div className="flex h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
                {/* Desktop Sidebar */}
                <DesktopSidebar />

                {/* Mobile Sidebar */}
                <MobileSidebar />

                {/* Main Content */}
                <div className={`flex-1 flex flex-col ${themeClasses.bg} ${isMobile && !selectedConversation ? 'hidden' : ''}`}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header - Hidden on mobile as info is in main header */}
                            <div className={`p-4 ${themeClasses.cardBg} ${themeClasses.border} border-b hidden md:block`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-500" />
                                            <span className={`font-medium ${themeClasses.text}`}>
                                                {selectedConversation.customerName}
                                            </span>
                                        </div>
                                        <ArrowRight className={`w-4 h-4 ${themeClasses.textMuted}`} />
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-green-500" />
                                            <span className={`font-medium ${themeClasses.text}`}>
                                                {selectedConversation.supplierName}
                                            </span>
                                        </div>
                                    </div>

                                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedConversation.status)}`}>
                                        {selectedConversation.status?.charAt(0).toUpperCase() + selectedConversation.status?.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <MessageCircle className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 ${themeClasses.textMuted}`} />
                                        <h3 className={`text-lg font-medium mb-2 ${themeClasses.text}`}>No messages yet</h3>
                                        <p className={themeClasses.textSecondary}>This conversation hasn't started</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {messages.map(message => (
                                            <MessageBubble key={message.id} message={message} />
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={`flex-1 items-center justify-center ${isMobile ? 'hidden' : 'flex'}`}>
                            <div className="text-center">
                                <MessageCircle className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 ${themeClasses.textMuted}`} />
                                <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${themeClasses.text}`}>Select a Conversation</h3>
                                <p className={themeClasses.textSecondary}>Choose a conversation from the list to view messages</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Conversation List (when no conversation is selected) */}
                {isMobile && !selectedConversation && (
                    <div className="flex-1 flex flex-col">
                        <ConversationsList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessagesMonitor;