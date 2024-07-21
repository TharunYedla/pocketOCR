import React, { useContext, useState } from 'react';
import {
    VStack,
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    HStack,
    Text,
    Spacer,
    Image,
    Button,
    Flex,
    Stack,
    IconButton,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaHistory } from 'react-icons/fa';
import { RecentItem } from './../context/AppContext';
import AppContext from './../context/AppContext';

function formatDate(date: Date) {
    const options: {
        year: 'numeric';
        month: 'long';
        day: 'numeric';
        hour?: 'numeric' | '2-digit';
        minute?: 'numeric' | '2-digit';
    } = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    return new Date(date).toLocaleDateString([], options);
}

interface ReactTabItemProps {
    recent: RecentItem;
}
export const RecentTabItem: React.FC<ReactTabItemProps> = ({ recent }) => {
    return (
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <HStack w='full' marginRight={'lg'} spacing={10}>
                        <Text fontSize='lg' color='gray.400'>
                            <Box as='span' color='brand.600'>
                                Type:{' '}
                            </Box>
                            {`${recent.type}`}
                        </Text>
                        <Spacer />
                        <Text color='gray.400'>{`${formatDate(
                            recent.date as Date
                        )}`}</Text>
                        <AccordionIcon />
                    </HStack>
                </AccordionButton>
            </h2>
            <AccordionPanel p={4}>
                <Flex
                    flexDirection='row'
                    justifyContent='center'
                    h='full'
                    w='full'
                    alignItems='center'>
                    <Stack
                        direction={{
                            base: 'column',
                            md: 'row',
                        }}
                        spacing={{
                            base: '3',
                            md: '6',
                            lg: '10',
                        }}
                        alignItems='center'>
                        <VStack>
                            <Image src={recent.imageLink} w='auto' />
                        </VStack>
                        <VStack
                            h='full'
                            w='full'
                            display='flex'
                            justifyContent='center'
                            alignContent='center'
                            textAlign='center'>
                            <Text color='gray.400'>
                                * You can now preview the autogenerated PDF *
                            </Text>
                            <Button
                                as='a'
                                target='_blank'
                                variant='primary'
                                borderRadius={'lg'}
                                href={recent.pdfLink}>
                                View PDF
                            </Button>
                        </VStack>
                    </Stack>
                </Flex>
            </AccordionPanel>
        </AccordionItem>
    );
};

interface RecentTabProps {}

export const RecentTab: React.FC<RecentTabProps> = ({}) => {
    const { state } = useContext(AppContext);
    const [recents, setRecents] = useState(state.user.recent);

    const getRecentsHandler = () => {
        (async () => {
            const resp = await axios.get('http://localhost:4000/getRecents', {
                headers: {
                    'x-auth-token': state.user.token,
                },
            });
            console.log(resp.data);
            setRecents(resp.data);
        })();
    };
    return (
        <>
            <HStack w='full' spacing={10} padding={1} pr={[2, 4, 6]}>
                <Spacer />
                <Button onClick={getRecentsHandler} variant={'link'}>
                    Refresh
                </Button>
            </HStack>
            <VStack w='full' alignItems='flex-start' p={0} spacing={0}>
                <Accordion w='full' defaultIndex={[0]} allowMultiple>
                    {[...recents].reverse().map((item, idx) => (
                        <RecentTabItem key={idx} recent={item} />
                    ))}
                </Accordion>
            </VStack>
        </>
    );
};
