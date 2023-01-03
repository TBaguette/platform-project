import * as React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import DonutComponent from "../components/diagram/DonutDiagram";

describe("DonutComponent", () => {
    beforeAll(() => {
        const mockData = [
            { label: "Region 1", value: 30 },
            { label: "Region 2", value: 20 },
            { label: "Region 3", value: 50 },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "hydra:member": mockData }),
            })
        );
    });

    it("renders the chart and inputs correctly", async () => {
        const { getByTestId } = await act(async () => {
            return render(<DonutComponent />);
        });

        expect(getByTestId("chart")).toBeInTheDocument();
        expect(getByTestId("input")).toBeInTheDocument();
    });

    it("fetches and displays data correctly", async () => {
        const { getByText } = await act(async () => {
            return render(<DonutComponent />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        expect(getByText("Region 1")).toBeInTheDocument();
        expect(getByText("Region 2")).toBeInTheDocument();
        expect(getByText("Region 3")).toBeInTheDocument();
    });
});
