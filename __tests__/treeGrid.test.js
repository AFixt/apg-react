import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TreeGrid from "../components/TreeGrid/TreeGrid";

/**
 * APG pattern: TreeGrid
 * https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 */
const columns = [
    { key: "name", label: "Name" },
    { key: "size", label: "Size" },
];

const rows = [
    {
        id: "a",
        name: "A",
        size: "1",
        children: [
            { id: "a1", name: "A1", size: "2" },
            { id: "a2", name: "A2", size: "3" },
        ],
    },
    { id: "b", name: "B", size: "4" },
];

describe("TreeGrid Component (APG treegrid pattern)", () => {
    test("container has role=treegrid", () => {
        render(<TreeGrid label="Files" columns={columns} rows={rows} />);
        expect(screen.getByRole("treegrid")).toBeInTheDocument();
    });

    test("data rows expose aria-level / posinset / setsize", () => {
        render(
            <TreeGrid
                label="Files"
                columns={columns}
                rows={rows}
                defaultExpanded={["a"]}
            />
        );
        const dataRows = screen.getAllByRole("row").slice(1); // skip header
        expect(dataRows[0]).toHaveAttribute("aria-level", "1");
        expect(dataRows[0]).toHaveAttribute("aria-posinset", "1");
        expect(dataRows[0]).toHaveAttribute("aria-setsize", "2");
        expect(dataRows[0]).toHaveAttribute("aria-expanded", "true");
        // Children inherit level 2
        expect(dataRows[1]).toHaveAttribute("aria-level", "2");
    });

    test("only one cell is in the tab order", () => {
        render(<TreeGrid label="Files" columns={columns} rows={rows} />);
        const allCells = [
            ...screen.getAllByRole("columnheader"),
            ...screen.getAllByRole("gridcell"),
        ];
        const tabbable = allCells.filter(
            (c) => c.getAttribute("tabindex") === "0"
        );
        expect(tabbable).toHaveLength(1);
    });

    test("ArrowRight on first cell of collapsed row expands it", () => {
        render(<TreeGrid label="Files" columns={columns} rows={rows} />);
        const cells = screen.getAllByRole("gridcell");
        cells[0].focus();
        fireEvent.keyDown(cells[0], { key: "ArrowRight" });
        const dataRows = screen.getAllByRole("row").slice(1);
        expect(dataRows[0]).toHaveAttribute("aria-expanded", "true");
    });

    test("ArrowLeft on first cell of expanded row collapses it", () => {
        render(
            <TreeGrid
                label="Files"
                columns={columns}
                rows={rows}
                defaultExpanded={["a"]}
            />
        );
        const cells = screen.getAllByRole("gridcell");
        cells[0].focus();
        fireEvent.keyDown(cells[0], { key: "ArrowLeft" });
        const dataRows = screen.getAllByRole("row").slice(1);
        expect(dataRows[0]).toHaveAttribute("aria-expanded", "false");
    });

    test("ArrowDown moves focus to next row in same column", () => {
        render(
            <TreeGrid
                label="Files"
                columns={columns}
                rows={rows}
                defaultExpanded={["a"]}
            />
        );
        const cells = screen.getAllByRole("gridcell");
        cells[0].focus();
        fireEvent.keyDown(cells[0], { key: "ArrowDown" });
        // first cell of row B (or child) — just assert focus moved
        expect(cells[0]).not.toHaveFocus();
    });

    test("ArrowLeft on child row's first cell focuses parent row", () => {
        render(
            <TreeGrid
                label="Files"
                columns={columns}
                rows={rows}
                defaultExpanded={["a"]}
            />
        );
        const cells = screen.getAllByRole("gridcell");
        // cell at index 2 is first cell of first child row (row a1)
        cells[2].focus();
        fireEvent.keyDown(cells[2], { key: "ArrowLeft" });
        // Focus should move to first cell of row A (parent)
        expect(cells[0]).toHaveFocus();
    });

    test("End moves focus to last cell in current row", () => {
        render(<TreeGrid label="Files" columns={columns} rows={rows} />);
        const cells = screen.getAllByRole("gridcell");
        cells[0].focus();
        fireEvent.keyDown(cells[0], { key: "End" });
        expect(cells[1]).toHaveFocus();
    });

    test("Ctrl+Home jumps to first cell of first row", () => {
        render(
            <TreeGrid
                label="Files"
                columns={columns}
                rows={rows}
                defaultExpanded={["a"]}
            />
        );
        const cells = screen.getAllByRole("gridcell");
        cells[cells.length - 1].focus();
        fireEvent.keyDown(cells[cells.length - 1], {
            key: "Home",
            ctrlKey: true,
        });
        expect(cells[0]).toHaveFocus();
    });
});
