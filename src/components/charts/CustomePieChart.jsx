import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import CustomeTooltip from "./CustomeTooltip"
import CustomeLegend from "./CustomeLegend"


const CustomePieChart = ({ data, colors }) => {
    return (
        <ResponsiveContainer width="100%" height={325}>
            <PieChart>
                <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={130} innerRadius={100} labelLine={false}>
                    {data?.map((entry, index) => (
                        <Cell key={`Cell ${index}`} fill={colors[index % colors.length]} />

                    ))}

                </Pie>
                <Tooltip content={<CustomeTooltip/>}/>
                <Legend  content={<CustomeLegend/>}/>
            </PieChart>

        </ResponsiveContainer>
    )
}

export default CustomePieChart