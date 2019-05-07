@ECHO OFF
ECHO Congratulations! Your first batch file executed successfully.
sqlcmd -S 192.168.36.112 -U CRM_Finance -P 123@123a -i "C:\Users\Nguyen Cong Binh\Desktop\SQLTicket.sql"
PAUSE


