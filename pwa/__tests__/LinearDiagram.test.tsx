import * as React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LinearComponent, { SVG } from "../components/diagram/LinearDiagram";

describe("LinearComponent", () => {
    beforeAll(() => {
        const mockData = [
            { label: "01/2018", value: 30 },
            { label: "02/2018", value: 20 },
            { label: "03/2018", value: 50 },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "hydra:member": mockData }),
            })
        );
    });

    it("renders the chart and inputs correctly", async () => {
        const { getByTestId } = await act(async () => {
            return render(<LinearComponent />);
        });
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        expect(getByTestId("chart")).toBeInTheDocument();
        expect(getByTestId("input")).toBeInTheDocument();
    });

    it("fetches and displays data correctly", async () => {
        const mockData = [
            { label: "01/2018", value: 30 },
            { label: "02/2018", value: 20 },
            { label: "03/2018", value: 50 },
        ];

        const { getByTestId, getByText } = render(<div
            className={"chart"}
            data-testid="chart"
        ></div>);
        await act(async () => 
            SVG.LinearChartSVG(getByTestId("chart"), mockData, { top: 0, right: 0, bottom: 0, left: 0 }, { width: 500, height: 500 })
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        expect(getByText("30")).toBeInTheDocument();
        expect(getByText("20")).toBeInTheDocument();
        expect(getByText("50")).toBeInTheDocument();
    })
});
