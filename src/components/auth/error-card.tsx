import { CardWrapper } from "@/components/card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCard = () => {
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      headerLabel="Oops! Something went wrong!"
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamationTriangle className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
