import {
    AndFilter,
    BooleanFilter,
    DateFilter,
    DateType,
    Filter,
    Message,
    NumberFilter,
    OrFilter,
    StringFilter
} from "./types";

export function filterMessages(messages: Message[], filter: Filter): Message[] {
    return messages.filter((message) => evaluateFilter(message, filter));
}

function evaluateFilter(message: Message, filter: Filter): boolean {
    switch (filter.type) {
        case 'string':
            return evaluateStringFilter(message[filter.field] as string, filter);
        case 'number':
            return evaluateNumberFilter(message[filter.field] as number, filter);
        case 'boolean':
            return evaluateBooleanFilter(message[filter.field] as boolean, filter);
        case 'date':
            return evaluateDateFilter(message[filter.field] as DateType, filter);
        case 'or':
            return evaluateOrFilter(message, filter);
        case 'and':
            return evaluateAndFilter(message, filter);
        default:
            return false;
    }
}

function evaluateStringFilter(value: string, filter: StringFilter): boolean {
    switch (filter.operation) {
        case 'eq':
            return value === filter.value;
        case 'startsWith':
            return value.startsWith(filter.value);
        case 'endsWith':
            return value.endsWith(filter.value);
        case 'contains':
            return value.includes(filter.value);
        default:
            return false;
    }
}

function evaluateNumberFilter(value: number, filter: NumberFilter): boolean {
    switch (filter.operation) {
        case 'eq':
            return value === filter.value;
        case 'gt':
            return value > filter.value;
        case 'lt':
            return value < filter.value;
        case 'gte':
            return value >= filter.value;
        case 'lte':
            return value <= filter.value;
        default:
            return false;
    }
}

function evaluateBooleanFilter(value: boolean, filter: BooleanFilter): boolean {
    return value === filter.value;
}

function evaluateDateFilter(value: DateType, filter: DateFilter): boolean {
    const dateValue = typeof value === 'string' ? new Date(value) : value;

    switch (filter.operation) {
        case 'eq':
            return dateValue.getTime() === new Date(filter.value).getTime();
        case 'after':
            return dateValue > new Date(filter.value);
        case 'before':
            return dateValue < new Date(filter.value);
        default:
            return false;
    }
}

function evaluateOrFilter(message: Message, filter: OrFilter): boolean {
    return filter.filters.some((subFilter) => evaluateFilter(message, subFilter));
}

function evaluateAndFilter(message: Message, filter: AndFilter): boolean {
    return filter.filters.every((subFilter) => evaluateFilter(message, subFilter));
}
