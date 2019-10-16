import React from 'react'
import {
    TableView,
    Divider
} from '@apollosproject/ui-kit'

export default ({ children }) => (
    <TableView>
        {children.length
            ? children.map((n, i) => (
                <React.Fragment key={i}>
                    {n}
                    {i < children.length && <Divider />}
                </React.Fragment>
            ))
            : children
        }
    </TableView>
)