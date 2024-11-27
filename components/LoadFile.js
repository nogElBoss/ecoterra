import { Text, HStack, Button } from '@chakra-ui/react'
import {
    FileUpload,
    FileUploadTrigger,
    FileUploadDropzone,
} from '@saas-ui/file-upload'

export default function LoadFile({ onChange }) {
    return (
        <FileUpload
            /* Remove `getRootNode` in your code, only required for this example */
            maxFileSize={1024 * 1024}
            maxFiles={1}
            accept="zip/*"
            onChange={onChange}
            w="100%"
            bg="#C5C6C6"
        >
            {({ files, deleteFile }) => (
                <FileUploadDropzone>
                    <Text fontSize="lg" color="black">Drag your zip file here, or:</Text>
                    {!files?.length ? (
                        <FileUploadTrigger as={Button} bg="darkGreen" color="white">Select file</FileUploadTrigger>
                    ) : (
                        <HStack>
                            <Text fontSize="sm">{files[0].name}</Text>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteFile(files[0])
                                }}
                            >
                                Clear
                            </Button>
                        </HStack>
                    )}

                    <Text fontSize="lg" color="black">(Default CRS: EPSG:4326 - WGS 84)</Text>
                </FileUploadDropzone>
            )}
        </FileUpload>
    )
}