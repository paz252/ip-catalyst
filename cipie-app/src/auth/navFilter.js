import { SERVICES } from './permissions';

export const filterNavData = (navData, role) => {
    const hasAccess = (serviceKey) =>
        SERVICES[serviceKey]?.allowed?.includes(role);

    const filterItems = (items) =>
        items
            .map((item) => {
                // If no serviceKey → allow (like dashboard, profile, etc.)
                if (!item.serviceKey) return item;

                // If has access → keep
                if (hasAccess(item.serviceKey)) return item;

                // Otherwise remove
                return null;
            })
            .filter(Boolean)
            .map((item) => ({
                ...item,
                children: item.children ? filterItems(item.children) : undefined,
            }));

    return navData
        .map((section) => ({
            ...section,
            items: filterItems(section.items),
        }))
        .filter((section) => section.items.length > 0);
};