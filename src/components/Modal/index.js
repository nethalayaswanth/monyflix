import { useLocation, useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import ParamModal from "./paramModal";
import ExpandModal from "./expandModal";

const Modal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  let location = useLocation();

  const [{ activate, parent, activated }, dispatch] = useModalState();

  return (!parent && param ) ? <ParamModal /> : parent ? <ExpandModal /> : null;

  //return ((!parent && param) ? <ParamModal /> : parent ? <ExpandModal /> : null);
};

export default Modal;
