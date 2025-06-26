
const Agenda = ({ agenda, index }) => {
    console.log("Agenda Item:", agenda);
    return (
        <tr key={index} className="text-left hover:bg-gray-100 transition-colors duration-200">
            <td className="py-3 text-gray-700">
                {
                    agenda.agendaStartTime ?
                        new Date(agenda.agendaStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                        "No start time"
                }
            </td>
            <td className="py-3 text-gray-700">{agenda.agendaTitle}</td>
            <td className="py-3 text-gray-700">
                {
                    agenda.agendaEndTime ?
                        new Date(agenda.agendaEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                        "No end time"
                }
            </td>
            <td className="py-3 text-gray-700">{agenda.agendaDescription}</td>
        </tr>

    )
}
export default Agenda;