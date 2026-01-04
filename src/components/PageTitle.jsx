import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | BloodBridge</title>
    </Helmet>
  );
};

export default PageTitle;
