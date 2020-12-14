"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Sticky = exports.stickyStyles = exports.stickyRow = exports.stickyHeaderGroups = exports.getMarginRight = exports.columnIsFirstRightFixed = exports.columnIsLastLeftFixed = exports.getFixedValue = exports.checkErrors = void 0;
/* eslint-disable import/no-extraneous-dependencies */
var react_1 = __importDefault(require("react"));
exports.checkErrors = function (columns) {
    var hasGroups = !!columns.find(function (column) { return column.parent; });
    var fixedColumnsWithoutGroup = columns.filter(function (column) { return column.fixed && !column.parent; }).map(function (_a) {
        var Header = _a.Header;
        return "'" + Header + "'";
    });
    if (hasGroups && fixedColumnsWithoutGroup.length) {
        throw new Error("WARNING react-table-sticky:\n      \nYour ReactTable has group and fixed columns outside groups, and that will break UI.\n      \nYou must place " + fixedColumnsWithoutGroup.join(' and ') + " columns into a group (even a group with an empty Header label)\n");
    }
    var bugWithUnderColumnsFixed = columns.find(function (parentCol) { return !parentCol.fixed && parentCol.columns && parentCol.columns.find(function (col) { return col.fixed; }); });
    if (!bugWithUnderColumnsFixed)
        return;
    // @ts-ignore
    var childBugs = bugWithUnderColumnsFixed.columns.find(function (_a) {
        var fixed = _a.fixed;
        return fixed;
    });
    if (!childBugs)
        return;
    throw new Error("WARNING react-table-sticky:\n    \nYour ReactTable contain columns group with at least one child columns fixed.\n    \nWhen ReactTable has columns groups, only columns groups can be fixed\n    \nYou must set fixed: 'left' | 'right' for the '" + bugWithUnderColumnsFixed.Header + "' column, or remove the fixed property of '" + childBugs.Header + "' column.");
};
function getFixedValue(column) {
    if (column.fixed === 'left' || column.fixed === 'right') {
        return column.fixed;
    }
    if (column.parent) {
        return getFixedValue(column.parent);
    }
    return null;
}
exports.getFixedValue = getFixedValue;
function columnIsLastLeftFixed(columnId, columns) {
    var index = columns.findIndex(function (_a) {
        var id = _a.id;
        return id === columnId;
    });
    var column = columns[index];
    var nextColumn = columns[index + 1];
    var columnIsLeftFixed = getFixedValue(column) === 'left';
    var nextColumnIsLeftFixed = nextColumn && getFixedValue(nextColumn) === 'left';
    return columnIsLeftFixed && !nextColumnIsLeftFixed;
}
exports.columnIsLastLeftFixed = columnIsLastLeftFixed;
function columnIsFirstRightFixed(columnId, columns) {
    var index = columns.findIndex(function (_a) {
        var id = _a.id;
        return id === columnId;
    });
    var column = columns[index];
    var prevColumn = columns[index - 1];
    var columnIsRightFixed = getFixedValue(column) === 'right';
    var prevColumnIsRightFixed = prevColumn && getFixedValue(prevColumn) === 'right';
    return columnIsRightFixed && !prevColumnIsRightFixed;
}
exports.columnIsFirstRightFixed = columnIsFirstRightFixed;
function getMarginRight(columnId, columns) {
    var currentIndex = columns.findIndex(function (_a) {
        var id = _a.id;
        return id === columnId;
    });
    var rightMargin = 0;
    for (var i = currentIndex + 1; i < columns.length; i += 1) {
        if (columns[i].isVisible !== false) {
            rightMargin += columns[i].width;
        }
    }
    return rightMargin;
}
exports.getMarginRight = getMarginRight;
function getStyleFromColumn(column, columns) {
    var _a;
    var props = column.getHeaderProps();
    var fixed = getFixedValue(column);
    if (!fixed) {
        return props.style;
    }
    if (fixed !== 'left' && fixed !== 'right') {
        throw new Error("react-table-sticky: fixed value \"" + fixed + "\" is not allowed");
    }
    var margin = fixed === 'left'
        ? column.totalLeft
        : getMarginRight(column.id, columns);
    var isLastLeftFixed = columnIsLastLeftFixed(column.id, columns);
    var isFirstRightFixed = columnIsFirstRightFixed(column.id, columns);
    var style = __assign(__assign({}, props.style), (_a = { position: 'sticky' }, _a[fixed] = margin, _a.zIndex = 2, _a.backgroundColor = '#fff', _a));
    if (isLastLeftFixed) {
        style.boxShadow = '2px 0px 3px #ccc';
    }
    if (isFirstRightFixed) {
        style.boxShadow = '-2px 0px 3px #ccc';
    }
    return style;
}
function stickyHeaderGroup(headerGroup) {
    var headers = headerGroup.headers.map(function (header) {
        return __assign(__assign({}, header), { isLastLeftFixed: columnIsLastLeftFixed(header.id, headerGroup.headers), getHeaderProps: function () { return (__assign(__assign({}, header.getHeaderProps()), { style: getStyleFromColumn(header, headers) })); } });
    });
    return __assign(__assign({}, headerGroup), { headers: headers });
}
function stickyHeaderGroups(headerGroups) {
    return headerGroups.map(function (headerGroup, index) { return (__assign(__assign({}, stickyHeaderGroup(headerGroup)), { getHeaderGroupProps: function () {
            var props = headerGroup.getHeaderGroupProps();
            var style = __assign({}, props.style);
            var isLast = index === (headerGroups.length - 1);
            if (isLast) {
                style.boxShadow = '0px 3px 3px #ccc';
            }
            return __assign(__assign({}, props), { style: style });
        } })); });
}
exports.stickyHeaderGroups = stickyHeaderGroups;
function stickyRow(row) {
    var columns = row.cells.map(function (cell) { return cell.column; });
    exports.checkErrors(columns);
    var cells = row.cells.map(function (cell) {
        return __assign(__assign({}, cell), { getCellProps: function () { return (__assign(__assign({}, cell.getCellProps()), { style: getStyleFromColumn(cell.column, columns) })); } });
    });
    return __assign(__assign({}, row), { cells: cells });
}
exports.stickyRow = stickyRow;
exports.stickyStyles = {
    table: {
        overflow: 'scroll'
    },
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        background: '#fff'
    },
    body: {
        position: 'relative',
        zIndex: 0
    }
};
function StickyTable(props) {
    var style = props.style, restProps = __rest(props, ["style"]);
    return (react_1["default"].createElement("div", __assign({}, restProps, { style: __assign(__assign({}, exports.stickyStyles.table), style) })));
}
function StickyHeader(props) {
    var style = props.style, restProps = __rest(props, ["style"]);
    return (react_1["default"].createElement("div", __assign({}, restProps, { style: __assign(__assign({}, exports.stickyStyles.header), style) })));
}
function StickyBody(props) {
    var style = props.style, restProps = __rest(props, ["style"]);
    return (react_1["default"].createElement("div", __assign({}, restProps, { style: __assign(__assign({}, exports.stickyStyles.body), style) })));
}
exports.Sticky = {
    Table: StickyTable,
    Header: StickyHeader,
    Body: StickyBody
};
