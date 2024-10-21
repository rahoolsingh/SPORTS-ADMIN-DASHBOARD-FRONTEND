import propTypes from "prop-types";

function ConfirmationPopup({ message, confirmFunction, setShowConfirmation }) {
    return (
        <div className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-slate-800 p-4 rounded-lg w-96">
                <p className="text-center text-lg text-white">{message}</p>
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => {
                            confirmFunction();
                            setShowConfirmation(false);
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Yes (Confirm)
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirmation(false);
                        }}
                        className=" text-white px-4 py-2 "
                    >
                        No (Don't Update)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPopup;

ConfirmationPopup.propTypes = {
    message: propTypes.string,
    confirmFunction: propTypes.func,
    rejectFunction: propTypes.func,
    setShowConfirmation: propTypes.func,
};
