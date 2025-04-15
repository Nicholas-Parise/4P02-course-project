import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";
import { Member } from "../types/types"
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, Box, Divider } from '@mui/material';
import { Link } from "react-router-dom";
import { useState } from "react";


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
    const [isBlindModalOpen, setIsBlindModalOpen] = useState<boolean>(false)
    const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false)
    const [activeMember, setActiveMember] = useState<Member>()

    const toggleBlind = (member: Member) => {
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
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Owner</TableCell>
                            <TableCell align="center">Blind</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {members.map(member => {
                            return(
                                <TableRow key={member.id}>
                                    <Link to={`/profile/${member.id}`}>
                                    <TableCell className="!flex">
                                            <div className="flex justify-center">
                                                <img 
                                                    src={member.picture} 
                                                    className={`w-5 h-5 mr-3 overflow-hidden rounded-full ${member.pro && "ring-[#5651e5] ring-2 "}`}
                                                />
                                            </div>
                                            <div>
                                                {member.displayname}
                                            </div>
                                    </TableCell>
                                    </Link>
                                    <TableCell className="text-center">
                                        <span 
                                            onClick={() => (setActiveMember(member), setIsOwnerModalOpen(true))}
                                            className="fa-layers fa-fw cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faCrown} fontSize={18} className="text-[#5651e5]"/>
                                            {!member.owner && <FontAwesomeIcon icon={faSlash} fontSize={24} />}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            onClick={() => (setActiveMember(member), setIsBlindModalOpen(true))}
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


        

        { /*  Confirm Blind Toggle Dialog  */}
        { isOwner && activeMember && <Dialog
          open={isBlindModalOpen}
          onClose={() => setIsBlindModalOpen(false)}
          aria-labelledby="blind-confirm-dialog-title"
          aria-describedby="blind-confirm-dialog-description"
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
          <DialogTitle id="blind-confirm-dialog-title" sx={{ textAlign: "center", fontWeight: "bold" }}>
            Change Blind Status
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="blind-confirm-dialog-description" sx={{ textAlign: "center" }}>
              { activeMember.blind ? (
                "Are you sure you want to give this member the ability to see contributions to this wishlist?"
              )
              :
              (
                "Are you sure you want to make this member blind to this wishlist?"
              )
            }
            </DialogContentText>
            <Box className="flex items-center justify-center">
                <div className="flex">
                    <img 
                        src={activeMember.picture} 
                        className={`w-6 h-6 mr-3 overflow-hidden rounded-full ${activeMember.pro && "ring-amber-400 ring-2 "}`}
                    />
                </div>
                <div>
                    {activeMember.displayname}
                </div>
            </Box>
            <Divider sx={{marginTop: 2, marginBottom: 2}} />
            <DialogContentText id="blind-confirmdialog-description" sx={{ textAlign: "center" }}>
              This may alert the other members of this wishlist
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              onClick={() => (toggleBlind(activeMember), setIsBlindModalOpen(false))}
              sx={{
                flex: 1,
                marginRight: "8px",
                border: "1px solid green",
                color: "green",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#e6ffe6",
                },
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => setIsBlindModalOpen(false)}
              sx={{
                flex: 1,
                marginLeft: "8px",
                border: "1px solid #5651e5",
                color: "#5651e5",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#f0f0ff",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        }

        { /*  Confirm Owner Toggle Dialog  */}
        { isOwner && activeMember && <Dialog
          open={isOwnerModalOpen}
          onClose={() => setIsOwnerModalOpen(false)}
          aria-labelledby="owner-confirm-dialog-title"
          aria-describedby="owner-confirm-dialog-description"
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
          <DialogTitle id="owner-confirm-dialog-title" sx={{ textAlign: "center", fontWeight: "bold" }}>
            Change Owner Status
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="owner-confirm-dialog-description" sx={{ textAlign: "center" }}>
              { activeMember.owner ? (
                "Are you sure you want to remove this member's ownership privileges?"
              )
              :
              (
                "Are you sure you want to give this member ownership privileges to this wishlist?"
              )
            }
            </DialogContentText>
            <Box className="flex items-center justify-center">
                <div className="flex">
                    <img 
                        src={activeMember.picture} 
                        className={`w-6 h-6 mr-3 overflow-hidden rounded-full ${activeMember.pro && "ring-amber-400 ring-2 "}`}
                    />
                </div>
                <div>
                    {activeMember.displayname}
                </div>
            </Box>
            { activeMember.id == userID && activeMember.owner &&
                <>
                    <Divider sx={{marginTop: 2, marginBottom: 2}} />
                    <DialogContentText id="owner-confirm-dialog-description" sx={{ textAlign: "center", color: "red" }}>
                        You will not be able to make yourself an owner after this!
                    </DialogContentText>
                </>
            }
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              onClick={() => (toggleOwner(activeMember), setIsOwnerModalOpen(false))}
              sx={{
                flex: 1,
                marginRight: "8px",
                border: "1px solid green",
                color: "green",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#e6ffe6",
                },
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => setIsOwnerModalOpen(false)}
              sx={{
                flex: 1,
                marginLeft: "8px",
                border: "1px solid #5651e5",
                color: "#5651e5",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#f0f0ff",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        }
                
    


            </DialogContent>
        </Dialog>
  )
}

export default MemberDialog