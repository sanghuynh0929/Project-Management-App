// src/utils/date.ts
/**
 * Trả về dd/MM/yyyy hoặc '—' nếu giá trị không hợp lệ.
 */
export const formatDate = (v?: string | Date | null): string => {
    if (!v) return '—';
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB');
};
