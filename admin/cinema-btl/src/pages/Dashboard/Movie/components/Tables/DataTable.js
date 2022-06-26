import React, { useState, useRef } from 'react';
import { Button, Image } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import { orderBy } from 'lodash';
import './styles.scss';
import { useDispatch } from 'react-redux';
import { removeMovie } from '../../../../../redux/actions/movieActions';
import ModalForm from '../Modals/Modal';
import moment from 'moment';
import Alert from '../../../../../services/Alert';

function DataTable(props) {
  const { movies } = props;
  const [isShow, setIsShow] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const columns = [
    {
      key: 'id',
      text: 'ID',
      sortable: true,
      cell: (movie, index) => {
        return index + 1;
      },
    },
    {
      key: 'poster',
      text: 'Poster',
      sortable: true,
      cell: (movie) => {
        return <Image src={movie.poster} width={120}></Image>;
      },
    },
    {
      key: 'title',
      text: 'Title',
      sortable: true,
      width: 150,
    },
    {
      key: 'director',
      text: 'Director',
    },
    {
      key: 'actor',
      text: 'Actor',
      width: 200,
    },
    {
      key: 'genre',
      text: 'Genre',
      width: 200,
    },
    {
      key: 'running_time',
      text: 'Running Time',
      sortable: true,
    },
    {
      key: 'release_date',
      text: 'Release Date',
      sortable: true,
      cell: (movie) => {
        return moment(movie.release_date).format('DD/MM/YYYY');
      },
      width: 120,
    },
    {
      key: 'trailer',
      text: 'Trailer',
      cell: (movie) => {
        let videoId = getId(movie.trailer);
        return (
          <iframe
            title={movie.title}
            controls
            allowFullScreen
            src={`https://www.youtube.com/embed/${videoId}`}
          />
        );
      },
    },
    {
      key: 'state',
      text: 'State',
      sortable: true,
      cell: (movie) => {
        return movie.state === 'now-showing' ? 'Now Showing' : 'Coming Soon';
      },
    },
    {
      key: 'active',
      text: 'Active',
      sortable: true,
      cell: (movie) => {
        return movie.active === true ? 'True' : 'False';
      },
    },
    {
      key: 'action',
      text: 'Action',
      cell: (movie) => {
        return (
          <Button className="button-trash" onClick={() => handleDelete(movie.id)}>
            <i className="bx bxs-trash-alt"></i>
          </Button>
        );
      },
    },
  ];

  const config = {
    page_size: 6,
    show_filter: false,
    show_length_menu: false,
    show_pagination: true,
    pagination: 'advance',
  };

  const deleteMovie = (id) => {
    dispatch(removeMovie(id));
  };

  const onSort = (column, records, sortOrder) => {
    return orderBy(records, [column], [sortOrder]);
  };

  const getId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const rowClickedHandler = (event, data, rowIndex) => {
    setData(data);
    setIsShow((isShow) => !isShow);
  };

  //You can put all product information into diaglog
  const [dialog, setDialog] = useState({
    message: '',
    isLoading: false,
    //Update
    nameProduct: '',
  });
  const idRow = useRef();
  const handleDialog = (message, isLoading, nameProduct) => {
    setDialog({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };

  const handleDelete = (id) => {
    //Update
    setIsShow((isShow) => !isShow);

    handleDialog('Are you sure you want to delete?', true, 'Movie');
    idRow.current = id;
  };

  const areUSureDelete = (choose) => {
    if (choose) {
      deleteMovie(idRow.current);
      handleDialog('', false);
    } else {
      handleDialog('', false);
    }
  };

  return (
    <>
      {isShow ? (
        <ModalForm isShow={isShow} data={data} method="eidt" title="Edit Movie" />
      ) : (
        ''
      )}
      <ReactDatatable
        responsive
        hover
        config={config}
        records={movies}
        columns={columns}
        onSort={onSort}
        onRowClicked={rowClickedHandler}
      />
      {dialog.isLoading && (
        <Alert
          //Update
          nameProduct={dialog.nameProduct}
          onDialog={areUSureDelete}
          message={dialog.message}
        />
      )}
    </>
  );
}

export default DataTable;
