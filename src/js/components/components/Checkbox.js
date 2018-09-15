import React from 'react';
import styled from 'styled-components';

export default ({checked, children}) => (
    <Checkbox>
        <Checkmark />
        {children}
    </Checkbox>
)
const Checkbox = styled.div`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  input {
    position: absolute;
    opacity: 0;
  }
`;
const Checkmark = styled.span`
      position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  &:after{
      content: "";
  position: absolute;
  display: none;
  }
`;