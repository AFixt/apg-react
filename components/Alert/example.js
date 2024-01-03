import React from "react";
import Alert from "./Alert"; // Adjust the import path based on your project structure

function App() {
    return (
        <div>
            <h1>My Application</h1>
            {/* Example usage of Alert component */}
            <Alert message="This is an info alert" type="info" />
            <Alert message="This is a warning alert" type="warning" />
            <Alert message="This is an error alert" type="error" />
        </div>
    );
}

export default App;
