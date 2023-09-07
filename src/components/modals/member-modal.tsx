'use client';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalStore, onClose, onOpen } from '@/stores/features/Modal';
import { ServerWithMembersWithProfiles } from '@/types/type';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import {
  useDeleteMemberMutation,
  useUpdateRoleMutation,
} from '@/stores/RtkQuery/Member';
import { useRouter } from 'next/navigation';

const MemberModal = () => {
  const modalState: ModalStore | any = useAppSelector(
    (state) => state.ModalFeature
  );

  const router = useRouter();

  const [loadingId, setLoadingId] = useState('');

  const server: ServerWithMembersWithProfiles | any = modalState?.data;

  const dispatch = useAppDispatch();

  const [updateRole] = useUpdateRoleMutation();

  const [deleteMember] = useDeleteMemberMutation();

  const isOpen = modalState?.isOpen && modalState?.type === 'memberManage';

  const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
    ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
  };

  const onRoleChange = async (id: string, role: MemberRole) => {
    try {
      setLoadingId(id);

      const resData: any = await updateRole({ id, role, serverId: server?.id });

      router.refresh();

      dispatch(onOpen({ type: 'memberManage', data: resData?.data?.data }));
    } catch (error) {
      return error;
    } finally {
      setLoadingId('');

      dispatch(onClose());
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const redData: any = await deleteMember({
        id: memberId,
        serverId: server?.id,
      });

      router.refresh();

      dispatch(onOpen({ type: 'memberManage', data: redData?.data?.data }));
    } catch (error) {
    } finally {
      setLoadingId('');

      dispatch(onClose());
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold'>
              Manage Members
            </DialogTitle>

            <DialogDescription className='text-center'>
              {server?.Member?.length} Members
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className='py-6'>
            <div className='space-y-2'>
              {server?.Member?.map((member: any) => (
                <div key={member.profile.id} className='flex items-center'>
                  <UserAvatar src={member?.profile.imageUrl} />

                  <div className='flex flex-col gap-y-1 ml-2'>
                    <p className='text-xs font-semibold flex items-center'>
                      {member.profile.name}
                      {roleIconMap[member?.role as keyof typeof roleIconMap]}
                    </p>

                    <p className='text-xs text-zinc-500'>
                      {member?.profile?.email}
                    </p>
                  </div>
                  {server?.profileId !== member?.profileId &&
                  loadingId !== member?.id ? (
                    <div className='ml-auto mr-1'>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className='w-4 h-4 text-zinc-500' />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side='left'>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='flex items-center'>
                              <ShieldQuestion className='w-4 h-4 mr-2' />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>

                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member?.id, 'GUEST')
                                  }
                                >
                                  <Shield className='w-4 h-4 mr-2' />
                                  Guest
                                  {member?.role === 'GUEST' && (
                                    <Check className='w-4 h-4 ml-auto' />
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member?.id, 'MODERATOR')
                                  }
                                >
                                  <ShieldCheck className='w-4 h-4 mr-2' />
                                  Moderator
                                  {member?.role === 'MODERATOR' && (
                                    <Check className='w-4 h-4 ml-auto' />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem onClick={() => onKick(member?.id)}>
                            <Gavel className='w-4 h-4 mr-2' />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : null}
                  <div>
                    {loadingId === member.id ? (
                      <Loader2 className='w-4 h-4 animate-spin text-zinc-500 ml-auto ' />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default MemberModal;
