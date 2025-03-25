import { useState, useEffect } from "react";

export default function Home() {
    const [category, setCategory] = useState("委任");
    const [grade, setGrade] = useState(1);
    const [level, setLevel] = useState(1);
    const [table, setTable] = useState("表二");
    const [salaryData, setSalaryData] = useState(null);

    const categories = ["委任", "薦任", "簡任"];
    const grades = {
        "委任": [1, 2, 3, 4, 5],
        "薦任": [6, 7, 8, 9],
        "簡任": [10, 11, 12, 13, 14]
    };
    const levels = [1, 2, 3, 4, 5, 6, 7];
    const tables = ["表二", "表三", "表五", "表六", "表七", "表十", "表十四", "表二十", "表二十四"];

    // 🚀 當 `category` 變更時，自動調整 `grade`
    useEffect(() => {
        setGrade(grades[category][0]);  // 設為該類別的第一個職等
    }, [category]);

    const fetchSalary = async () => {
        const response = await fetch("/api/salary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                category,
                grade: Number(grade),  // 確保 grade 是數字
                level: Number(level),  // 確保 level 是數字
                table
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Received salary data:", data);
            setSalaryData(data);
        } else {
            console.log("Error fetching salary data");
            setSalaryData({ error: "查無薪資資料" });
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>我賺多少錢？</h1>

            <label>我是
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                    {grades[category].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                職等
            </label>

            <label> 本俸
                <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
                    {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
            </label>

            <label> 我領
                <select value={table} onChange={(e) => setTable(e.target.value)}>
                    {tables.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            </label>

            <button onClick={fetchSalary} style={{ marginLeft: "10px", padding: "5px 10px" }}>
                查詢
            </button>

            {salaryData && (
                <div style={{ marginTop: "20px" }}>
                    {salaryData.error ? (
                        <p style={{ color: "red" }}>{salaryData.error}</p>
                    ) : (
                        <>
                            <p>本俸：{salaryData.baseSalary.toLocaleString()} 元</p>
                            <p>專業加給：{salaryData.allowance.toLocaleString()} 元</p>
                            <h3>總薪資：{salaryData.totalSalary.toLocaleString()} 元</h3>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
