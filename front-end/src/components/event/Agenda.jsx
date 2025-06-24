
const Agenda = ({agenda, index}) => {
    console.log("Agenda Item:", agenda);
    return (
        <tr key={index}>
            <td className="py-3 text-gray-700">
                {
                    agenda.agendaStartTime ?
                        new Date(agenda.agendaStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                        "No start time"
                }
            </td>
            <td className="py-3 text-gray-700">{agenda.agendaTitle}</td>
        </tr>

    )
}
export default Agenda;