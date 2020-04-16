import React from 'react';
import { styled, TableView, Divider, H4 } from '@apollosproject/ui-kit';

const Title = styled(({ theme, marginTop }) => ({
    marginBottom: theme.sizing.baseUnit * 0.5,
    marginLeft: theme.sizing.baseUnit,
    marginTop: marginTop ? theme.sizing.baseUnit : 0,
}))(H4);

const StyledTableView = styled(({ theme, marginTop }) => ({
    backgroundColor: 'transparent',
}))(TableView);

export default ({ title, children, padded }) => [
    title !== '' && (
        <Title key="TableViewTitle" marginTop={padded}>
            {title}
        </Title>
    ),
    <StyledTableView key="TableViewBody">
        {children.length
            ? children.map((n, i) => (
                <React.Fragment key={i}>
                    {n}
                    {i < children.length && <Divider />}
                </React.Fragment>
            ))
            : children}
    </StyledTableView>,
];
