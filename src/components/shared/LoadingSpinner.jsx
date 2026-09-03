import { Spinner } from "@heroui/react";

const LoadingSpinner = () => {
    return (
        <div className="flex min-h-[50vh] w-full items-center justify-center">
            <Spinner size="lg" className="text-dll-primary" ></Spinner>
        </div>
    );
};

export default LoadingSpinner;
