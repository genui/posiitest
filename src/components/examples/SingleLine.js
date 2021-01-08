import React, {useState} from 'react'

import { Mention, MentionsInput } from '../../../src/src/'

import { provideExampleValue } from './higher-order'
import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Checkbox, Container, FormControlLabel, Grow, Modal, responsiveFontSizes, TextField } from '@material-ui/core'

function SingleLine({ value, data, onChange, onAdd }) {
  const useStyles = makeStyles(() => ({
    inputButon: {
      paddingTop:30
    },
    nameInputOff: {
      opacity:0.5,
    },
    nameInputOn: {
      opacity:0.8,
    },
    mentionParent:{
      position:"relative",
    },
  }))
  const classes = useStyles();
  const [nameOn, setnameOn] = useState(false)
  const clickInputName = () => {
    console.log('test');
  }
  const nameInputCheck = () => {
    if (nameOn) {
      setnameOn(false)
    } else {
      setnameOn(true)
    }
    console.log(nameOn);
  }
  let nameInput='';
  let inputClass = '';

  if (nameOn) {
    inputClass = classes.nameInputOn
    nameInput = <Container>
    <Grow in={true} timeout={{ enter: 1000 }}>
    <Box className={classes.inputButon}>
      <div className={classes.nameInput}>相手を入力してください。</div>
      <MentionsInput
        singleLine
        value={value}
        onChange={onChange}
        style={defaultStyle}
        placeholder={''}
      >
        <Mention
        trigger='@'
        data={data}
        onAdd={clickInputName}
        style={defaultMentionStyle} />
      </MentionsInput>
    </Box>
    </Grow>
    </Container>
  } else {
    inputClass = classes.nameInputOff
  }

  return (
    <div>
    <FormControlLabel
      className={inputClass}
      value="end" control={<Checkbox color="primary" />}
      label="誰かにメッセージを送る"
      onChange={nameInputCheck}
      labelPlacement="end" />
      {nameInput}

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {nameInput}
      </Modal>
    </div>
  )
}

const asExample = provideExampleValue('')

export default asExample(SingleLine)
