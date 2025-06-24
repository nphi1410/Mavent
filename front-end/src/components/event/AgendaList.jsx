import Agenda from "./Agenda";
import { useEffect, useState } from "react";
import { getAgendaItemsByEventId } from "../../services/agendaService";

const AgendaList = ({ eventId }) => {
    const [agendaItems, setAgendaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgendaItems = async () => {
            try {
                const items = await getAgendaItemsByEventId(eventId);
                setAgendaItems(items);
            } catch (err) {
                console.error("Failed to fetch agenda items:", err);
                setError("Failed to fetch agenda items.");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchAgendaItems();
        }
    }, [eventId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AGENDA</h2>
            <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {agendaItems.map((agenda, index) => (
                            <Agenda key={index} agenda={agenda} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AgendaList;