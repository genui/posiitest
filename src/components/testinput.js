import React, { useState, useRef } from "react";
import { MentionsInput, Mention } from 'react-mentions';

export default function Testinput(props) {
    const userData = [
        {
          id: 'walter',
          display: 'Walter White',
        },
        {
          id: 'jesse',
          display: 'Jesse Pinkman',
        },
        {
          id: 'walter2',
          display: 'Walter White2',
        },
        {
          id: 'jesse2',
          display: 'Jesse Pinkman2',
        },
        {
          id: 'walter3',
          display: 'Walter White3',
        },
        {
          id: 'jesse4',
          display: 'Jesse Pinkman4',
        }
      ]
    const [content,setContent] = useState('test');
    const [handleContentChange,setHandleContentChange] = useState('');

    const mentionSet = () => {
        console.log('test!');
    }
    const value = () => {
        setContent('value')
        console.log(content);
    }
    const onChange1 = (event) => {
        setHandleContentChange(event.target.value)
        console.log(handleContentChange);
    }
    return(
        <div>
            <MentionsInput
                onChange={onChange1}
                placeholder={"'@'でメンションできます！"}
                >
                <Mention
                data={userData}
                onAdd={mentionSet}
                markup='@__display__'
                />
            </MentionsInput>
        </div>
    )
}