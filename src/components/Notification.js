import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notify = ({ props }) => {
  switch(props.type){
    case 'success':
      return toast.success(props.message,props?.options??{});
    case 'error':
      return toast.error(props.message,props?.options??{});
    case 'warning':
      return toast.warn(props.message,props?.options??{});
    case 'info':
      return toast.info(props.message,props?.options??{});
    default:
      return toast(props.message,props?.options??{});
  }
};
export default Notify;