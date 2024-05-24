import {ListGroup} from 'react-bootstrap';
import { Link, Navigate, useNavigate} from 'react-router-dom';

/**
 * This components requires:
 * - the list of filters labels to show, 
 * - the filter that is currenctly selected 
 */ 
const Filters = (props) => {
  const {items } = props;
  const navigate = useNavigate();
  return (

    <ListGroup as="ul" className="my-2">
        {
          items.map( e => {
            return (
                <ListGroup.Item as="li" key={e.filterName} href={'#'} 
                  action onClick={() => {props.onSelect(e.filterName); navigate(`/filter/${e.filterName}`)}} active={e.selected == true ? true : false} >
                    {e.label}
                </ListGroup.Item>
            );
          })
        }
    </ListGroup>

  )
}

export { Filters };