import dynamic from "next/dynamic";
import IssueFormSkeleton from "./loading";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const NewIssuePage = () => {
  return (
    <div className="max-w-xl mx-auto px-5 py-10 bg-white rounded-md shadow-md">
      <div className="text-center text-2xl font-semibold mb-5 uppercase">
        Create a ticket
      </div>
      <IssueForm />
    </div>
  );
};

export default NewIssuePage;
