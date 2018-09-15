import styled, {injectGlobal} from 'styled-components';
import { appleJade, africanSapphire, blackOnyx, serpentine } from './colours';
export const Container = styled.div`
      max-width: 960px;
      padding: 10px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      background-color: white;
      margin: ${({large}) => large ? 'auto 10px' : '10px auto'};
`;
export const Loader = styled.div`
    border: 16px solid #f3f3f3;
    border-top: 16px solid ${appleJade};
    border-right: 16px solid ${africanSapphire};
    border-bottom: 16px solid ${blackOnyx};
    border-top: 16px solid ${serpentine};
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 150px;
    height: 150px;
    margin: -75px 0 0 -75px;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
`;
export const LoaderOverlay = styled.div`
position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(150,150,150,0.5);
  z-index: 2;
  cursor: pointer;
`
injectGlobal`

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    

    @-webkit-keyframes spin {
      0% { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }
`;


export const Accordian = styled.div`
    background-color: #f5f5f5;
    transition: 0.4s;
    color: black;
`;

export const SelectButton = styled.button`
      margin: 2px 0;
  background-color: #f5f5f5;
  border: none;
  width: 100%;
  padding: 5px 0;
`;