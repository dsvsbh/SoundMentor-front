export function formatDate(backendTime) {
    try {
        const date = new Date(backendTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("格式化日期失败：", error);
        return backendTime;
    }
}
