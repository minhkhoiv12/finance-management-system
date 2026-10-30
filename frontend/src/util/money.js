export const parseVietnameseAmount = (value) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const text = String(value ?? "").trim().replace(/\s/g, "");
    if (!text) return 0;

    // Chấp nhận 50.000, 50,000, 50 000 và 50000; dấu thập phân vẫn được hỗ trợ.
    const normalized = text.includes(".") && text.includes(",")
        ? text.replace(/\./g, "").replace(",", ".")
        : text.replace(/(\d)[.,](?=\d{3}(?:[.,]|$))/g, "$1").replace(",", ".");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
};

export const formatVND = (value, withSign = false) => {
    const amount = parseVietnameseAmount(value);
    const formatted = new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
    }).format(amount);
    return `${withSign && amount > 0 ? "+" : ""}${formatted} ₫`;
};

// Dùng cho nhãn trục biểu đồ: dấu cách không ngắt dòng giữ đơn vị cùng hàng với số tiền.
export const formatChartVND = (value) => {
    const amount = parseVietnameseAmount(value);
    const formatted = new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted}\u00A0đ`;
};
