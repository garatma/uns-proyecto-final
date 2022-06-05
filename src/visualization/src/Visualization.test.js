import { render, screen } from "@testing-library/react";
import Visualization from "./Visualization";

test("renders learn react link", () => {
    render(<Visualization />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
