import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {Paper} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    paper: {
      padding: theme.spacing.unit * 4,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      minHeight: '300px'
    }
  });
function MyDropzone(props) {
    const classes = props.classes;
    const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result
      props.action(binaryStr)
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Paper className={classes.paper}><p id="dropzone-content">Importer un fichier</p></Paper>
    </div>
  )
}

export default withStyles(styles)(MyDropzone)