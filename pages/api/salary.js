import salaryData from "../../data/salaryData.json";
import allowanceData from "../../data/allowanceData.json";

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { category, grade, level, table } = req.body;

    if (!category || !grade || !level || !table) {
        return res.status(400).json({ message: "Missing parameters" });
    }

    // 把數字職等轉換成對應的字串，例如 1 → "一職等"
    const gradeMap = ["一職等", "二職等", "三職等", "四職等", "五職等",
                      "六職等", "七職等", "八職等", "九職等", "十職等",
                      "十一職等", "十二職等", "十三職等", "十四職等"];
    const gradeStr = gradeMap[grade - 1]; // 轉換為對應字串

    console.log("Received data:", { category, grade, level, table });
    console.log("Grade string:", gradeStr);

    // 查詢本俸金額
    const categoryData = salaryData[category]; // 例如 "委任"
    if (!categoryData) return res.status(404).json({ message: "Category not found" });

    const gradeData = categoryData[gradeStr]; // 例如 "一職等"
    if (!gradeData) return res.status(404).json({ message: "Grade not found" });

    const salaryInfo = gradeData[level]; // 例如 "1"
    if (!salaryInfo) return res.status(404).json({ message: "Level not found" });

    const baseSalary = salaryInfo["月俸額"];

    // ✅ 修正專業加給查詢 (改用數字職等)
    const allowance = allowanceData[table] && allowanceData[table][grade] 
        ? allowanceData[table][grade] 
        : 0;

    // 計算總薪資
    const totalSalary = baseSalary + allowance;

    res.status(200).json({
        baseSalary,
        allowance,
        totalSalary
    });
}
