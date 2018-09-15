import styled from 'styled-components';
import { blackOnyx } from './colours';
export const Input = styled.input`
    padding: 12px;
    border: 1px solid ${blackOnyx};
    border-radius: 4px;
    margin-top: 6px;
    margin-bottom: 16px;
    width: ${({fluid}) => fluid ? "100%" : "auto"};
`;