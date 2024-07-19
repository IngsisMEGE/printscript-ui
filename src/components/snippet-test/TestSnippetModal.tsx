import {Box,  Divider, IconButton, Tab, Tabs, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {SyntheticEvent, useState} from "react";
import {AddRounded} from "@mui/icons-material";
import {useGetTestCases, usePostTestCase, useRemoveTestCase} from "../../utils/queries.tsx";
import {TabPanel} from "./TabPanel.tsx";
import {queryClient} from "../../App.tsx";
import {TestCase} from "../../types/TestCase";

type TestSnippetModalProps = {
    open: boolean
    onClose: () => void
    id: number
    author: string
}

export const TestSnippetModal = ({open, onClose, id, author}: TestSnippetModalProps) => {
    const [value, setValue] = useState(0);
    const {data: testCases} = useGetTestCases(id);
    const {mutateAsync: postTestCase} = usePostTestCase();
    const {mutateAsync: removeTestCase} = useRemoveTestCase({
        onSuccess: () => queryClient.invalidateQueries('testCases')
    }, id.toString(), author);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handlePostTestCase = (tc: Partial<TestCase>) => {
        postTestCase({
            ...tc,
            snippetId: id.toString(),
            authorEmail: author
        });
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <Typography variant={"h5"}>Test snippet</Typography>
            <Divider/>
            <Box mt={2} display="flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{borderRight: 1, borderColor: 'divider'}}
                >
                    {testCases?.map((testCase) => (
                        <Tab label={testCase.name}/>
                    ))}
                    <IconButton disableRipple onClick={() => setValue((testCases?.length ?? 0) + 1)}>
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases?.map((testCase, index) => (
                    <TabPanel index={index} value={value} test={testCase}
                              setTestCase={(tc) => postTestCase(tc)}
                              removeTestCase={(i) => removeTestCase(i)}
                    />
                ))}
                <TabPanel index={(testCases?.length ?? 0) + 1} value={value}
                          setTestCase={(tc) => handlePostTestCase(tc)}
                />
            </Box>
        </ModalWrapper>
    )
}
