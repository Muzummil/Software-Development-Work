
  .model small
        .stack 100h
        .data
        prompt  db  0ah, 0dh, "Enter Number$"
        cmndiv  db  0ah,0dh,"Common divider for both number is "
    commondiv   db  ?
       cmndiv1  db  " .$"
       nlcd   db  0ah, 0dh,"There is not common divider of both numbers$"
       number1  dw  ?
       number2  dw  ?
        .code

  start:
        mov ax, @data
        mov ds, ax


        lea dx, prompt
        mov ah, 9h
        int 21h
        mov ah, 1h
        int 21h
        mov bl, al
        sub bl, 30h
        mov ah, 1h
        int 21h
        sub al, 30h
        
        mov ah, bl
        mov number1, ax
        
	lea dx, prompt
        mov ah, 9h
        int 21h
        mov ah, 1h
        int 21h
        mov bl, al
        sub bl, 30h
        mov ah, 1h

        int 21h
        sub al, 30h
        mov ah, bl
        mov number2, ax

	   mov cl, 19d
           mov bh, 2d

	   commondividor:
                                        mov ah, 0h
                                        mov al, 0h
					mov ax, number1
                                        aad
					div bh
					cmp ah, 0d
                                        je further
                                        jne count


         count:
					inc bh
                                        cmp cx, 0d
                                        je nolcd
					loop commondividor

	  nolcd:
				mov dx, offset nlcd
					mov ah, 9h
					int 21h
					jmp term

	 further:
                                        mov ah, 0h
                                        mov al, 0h
					mov ax, number2
					aad 
					div bh
					cmp ah, 0d
                                        je lcd
                                        jmp count

	lcd:
	        mov commondiv, bh
		   add commondiv, 30h
		   mov dx, offset cmndiv
		   mov ah, 9h
		   int 21h
		   jmp term

        term:
        mov ax, 4c00h
        int 21h
        end start
