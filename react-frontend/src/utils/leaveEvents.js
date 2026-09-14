export function nextDay(isoDate) {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + 1);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(dt.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

export function toLocalDateStr(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function buildLeaveEvents(leaves, { source = "instructor" } = {}) {
    return leaves.flatMap(leave => {
        const events = [];
        let cursor = leave.startDate;
        const end = leave.endDate;

        while (cursor <= end) {
            events.push({
                id: `leave-${source}-${leave.id}-${cursor}`,
                start: `${cursor}T00:00:00`,
                end: `${cursor}T23:59:59`,
                display: "background",
                classNames: ["leave-block"],
                extendedProps: {
                    isLeave: true,
                    leaveId: leave.id,
                    leaveType: leave.type,
                    reason: leave.reason
                }
            });

            cursor = nextDay(cursor);
        }

        return events;
    });
}

export function isOverlappingLeave(start, end, leaves) {
    const startDay = toLocalDateStr(start);
    const endDay = toLocalDateStr(new Date(end.getTime() - 1));

    return leaves.some(leave => {
        return startDay <= leave.endDate && endDay >= leave.startDate;
    });
}

export function toBlockedRanges(leaves) {
    return leaves.map(l => ({ start: l.startDate, end: l.endDate }));
}