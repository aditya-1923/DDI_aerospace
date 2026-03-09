import { useEffect, useState } from "react";
import {
    getChangeRequests,
    getChangeTicketsByStatus
} from "../services/changeRequests.service";

export default function useChangeRequests() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const res = await getChangeRequests();
        setData(res.data);
        setLoading(false);
    };

    const filterByStatus = async (status) => {
        setStatus(status);
        setLoading(true);
        const res = await getChangeTicketsByStatus(status);
        setData(res.data);
        setLoading(false);
    };

    return {
        data,
        loading,
        filterByStatus,
        status
    };
}
