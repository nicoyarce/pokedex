import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary capturó:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontFamily: "sans-serif",
                    flexDirection: "column",
                    gap: "1rem"
                }}>
                    <h2>⚠️ Algo salió mal</h2>
                    <p>Intenta recargar la página.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: "0.5rem 1.5rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                            borderRadius: "0.5rem",
                            border: "none",
                            backgroundColor: "#dc0a2d",
                            color: "white"
                        }}
                    >
                        Recargar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
