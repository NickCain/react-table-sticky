import React from 'react';
interface Column {
    Header: any;
    columns?: Column[];
    fixed?: 'left' | 'right';
    getHeaderProps: () => {
        style: object;
    };
    id: string | number;
    parent?: Column;
    totalLeft: number;
}
export declare const checkErrors: (columns: Column[]) => void;
export declare function getFixedValue(column: Column): null | 'left' | 'right';
export declare function columnIsLastLeftFixed(columnId: Column['id'], columns: any): boolean;
export declare function columnIsFirstRightFixed(columnId: Column['id'], columns: any): boolean;
export declare function getMarginRight(columnId: Column['id'], columns: any): number;
export declare function stickyHeaderGroups<T extends any>(headerGroups: T): T;
export declare function stickyRow<T extends any>(row: T): T;
interface StickyProperties {
    body: React.CSSProperties;
    header: React.CSSProperties;
    table: React.CSSProperties;
}
export declare const stickyStyles: StickyProperties;
declare function StickyTable(props: React.HTMLProps<HTMLDivElement>): JSX.Element;
declare function StickyHeader(props: React.HTMLProps<HTMLDivElement>): JSX.Element;
declare function StickyBody(props: React.HTMLProps<HTMLDivElement>): JSX.Element;
export declare const Sticky: {
    Table: typeof StickyTable;
    Header: typeof StickyHeader;
    Body: typeof StickyBody;
};
export {};
