import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const supperAdminValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validate = async () => {
            try {
                const result = await api.post('/supper-admin/validate');

                if (!result.data.valid) {
                    throw new Error('Invalid token');
                }
            } catch (err) {
                console.log(err)
                navigate('/');
            }
        };

        validate();
    }, [navigate]);
};

export default supperAdminValidation;