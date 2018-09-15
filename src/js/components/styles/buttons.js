import styled from 'styled-components';
import { lighten, darken, clearFix } from 'polished';
import colours from './colours';
export const Button = styled.button`
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
      font-size: ${({size}) => {
          switch(size){
              case 'xs':
                  return 10;
              case 's':
                  return 12;
              case 'l':
                  return 20;
              case 'xl':
                  return 24;
          }
      }}px;
      background-color: ${({colour}) => colours[colour]};
      &:hover{
        background-color: ${({colour}) => darken(0.1, colours[colour])};
      }
      &:disabled{
        cursor: not-allowed;
        background-color: ${({colour}) => lighten(0.15, colours[colour])};
      }
`;

export const ButtonGroup = styled.div`
    float: left;
    margin: 0;
    ${clearFix()}
`;
export const IconButton = styled.button`
    ${({small}) => small ? `
        padding: 5px;
        font-size: 20px;
        top: 0;
        bottom: 0;
    ` : `
        padding: 20px;
        font-size: 30px;
        width: 50px;
    `}    
    text-align: center;
    text-decoration: none
`;