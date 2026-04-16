import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Grid from "../components/Grid/Grid";

/**
 * APG pattern: Grid
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
];
const rows = [
    { id: 1, name: "Ada", role: "Mathematician" },
    { id: 2, name: "Alan", role: "Cryptanalyst" },
    { id: 3, name: "Grace", role: "Scientist" },
];

describe("Grid Component (APG grid pattern)", () => {
    test("container has role=grid and aria-row/colcount", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const grid = screen.getByRole("grid");
        expect(grid).toHaveAttribute("aria-rowcount", "4");
        expect(grid).toHaveAttribute("aria-colcount", "2");
        expect(grid).toHaveAttribute("aria-label", "People");
    });

    test("renders columnheader cells in the header row", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        expect(screen.getAllByRole("columnheader")).toHaveLength(columns.length);
    });

    test("renders gridcell cells for data rows", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        expect(screen.getAllByRole("gridcell")).toHaveLength(
            columns.length * rows.length
        );
    });

    test("only one cell is in the tab order", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const allCells = [
            ...screen.getAllByRole("columnheader"),
            ...screen.getAllByRole("gridcell"),
        ];
        const tabbable = allCells.filter((c) => c.getAttribute("tabindex") === "0");
        expect(tabbable).toHaveLength(1);
    });

    test("ArrowRight moves focus to next cell in row", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const headers = screen.getAllByRole("columnheader");
        headers[0].focus();
        fireEvent.keyDown(headers[0], { key: "ArrowRight" });
        expect(headers[1]).toHaveFocus();
    });

    test("ArrowDown moves focus into data row", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const headers = screen.getAllByRole("columnheader");
        headers[0].focus();
        fireEvent.keyDown(headers[0], { key: "ArrowDown" });
        const cells = screen.getAllByRole("gridcell");
        expect(cells[0]).toHaveFocus();
    });

    test("End moves to last cell in current row", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const headers = screen.getAllByRole("columnheader");
        headers[0].focus();
        fireEvent.keyDown(headers[0], { key: "End" });
        expect(headers[headers.length - 1]).toHaveFocus();
    });

    test("Ctrl+Home jumps to first header cell", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const cells = screen.getAllByRole("gridcell");
        cells[cells.length - 1].focus();
        fireEvent.keyDown(cells[cells.length - 1], { key: "Home", ctrlKey: true });
        const headers = screen.getAllByRole("columnheader");
        expect(headers[0]).toHaveFocus();
    });

    test("Ctrl+End jumps to last gridcell", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const headers = screen.getAllByRole("columnheader");
        headers[0].focus();
        fireEvent.keyDown(headers[0], { key: "End", ctrlKey: true });
        const cells = screen.getAllByRole("gridcell");
        expect(cells[cells.length - 1]).toHaveFocus();
    });

    test("each cell has aria-colindex and rows have aria-rowindex", () => {
        render(<Grid label="People" columns={columns} rows={rows} />);
        const firstCell = screen.getAllByRole("columnheader")[0];
        expect(firstCell).toHaveAttribute("aria-colindex", "1");
        const allRows = screen.getAllByRole("row");
        expect(allRows[0]).toHaveAttribute("aria-rowindex", "1");
    });
});
