import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";
import { Member } from "../types/types"
import { Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';


interface Props {
    open: boolean, 
    setOpen: (state: boolean) => void,
    members: Member[],
    userID: number, 
    isOwner: boolean,
    setBlind: (state: boolean) => void,
    setOwner: (state: boolean) => void,
    editMember: (item: Member) => void,
    wishlistID: number,
    token: string,
}

const MemberDialog = ({ open, setOpen, members, userID, isOwner, setBlind, setOwner, editMember, wishlistID, token }: Props) => {

    const toggleBlind = (member: Member) => {
        if (!isOwner) return

        const newMember = {
            ...member,
            blind: !member.blind
        }

        let status_code = -1
        let url = `https://api.wishify.ca/wishlists/${wishlistID}/members`
        // update blind status
        fetch(url, {
            method: 'put',
            headers: new Headers({
                'Authorization': "Bearer "+token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "userId":member.id,
                "blind": !member.blind,
            })
        })
        .then((response) => {
            status_code = response.status
            return response.json();
        })
        .then(() => {
            if(status_code != 200 && status_code != 201){
              return
            }
            editMember(newMember)
            if(newMember.id == userID){
                setBlind(!member.blind)
            }
        })
        .catch((error) => {
            console.log(error)
        })
        
    }

    const toggleOwner = (member: Member) => {
        if (!isOwner) return

        const newMember = {
            ...member,
            owner: !member.owner
        }

        let status_code = -1
        let url = `https://api.wishify.ca/wishlists/${wishlistID}/members`
        // update blind status
        fetch(url, {
            method: 'put',
            headers: new Headers({
                'Authorization': "Bearer "+token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "userId":member.id,
                "owner": !member.owner,
            })
        })
        .then((response) => {
            status_code = response.status
            return response.json();
        })
        .then(() => {
            if(status_code != 200 && status_code != 201){
              return
            }
            editMember(newMember)
            if(newMember.id == userID){
                setOwner(!member.owner)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <Dialog 
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="item-dialog-title"
            aria-describedby="item-dialog-description"
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: '25px', // Rounded corners
                background: '#FFFFFF', // Background color matching ProfileMenu
                padding: '20px',
                border: '2px solid #5651e5', // Border color
                maxWidth: '900px', // Set max width to 900px
                minWidth: '370px'
                //width: '100%', // Ensure it takes full width up to the max width
              },
            }}
        >
            <DialogTitle id="item-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: '24px' }}>
                Wishlist Members
            </DialogTitle>
            <DialogContent className="sm:max-w-[425px]">
                
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Owner</TableCell>
                            <TableCell align="center">Blind</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {members.map(member => {
                            return(
                                <TableRow key={member.id}>
                                    <TableCell>{member.displayname}</TableCell>
                                    <TableCell className="text-center">
                                        <span 
                                            onClick={() => toggleOwner(member)}
                                            className="fa-layers fa-fw cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faCrown} fontSize={18} className="text-[#5651e5]"/>
                                            {!member.owner && <FontAwesomeIcon icon={faSlash} fontSize={24} />}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            onClick={() => toggleBlind(member)}
                                            className="fa-layers fa-fw cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faEye} fontSize={18} className="text-[#5651e5]"/>
                                            {member.blind && <FontAwesomeIcon icon={faSlash} fontSize={24} />}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
                
    
                
            </DialogContent>
        </Dialog>
  )
}

export default MemberDialog