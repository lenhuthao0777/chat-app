
interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params: { id } }: PageProps) => {
  return (
    <div>
      Servers{id}
    </div>
  );
};

export default Page;
