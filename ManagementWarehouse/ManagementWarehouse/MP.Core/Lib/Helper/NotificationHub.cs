
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KTStore.MP.Core.Lib.Helper
{
    [HubName("notificationHub")]
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, User> Users = new ConcurrentDictionary<string, User>(StringComparer.InvariantCultureIgnoreCase);

        #region Methods
     
      
        /// <summary>
        /// Provides the handler for SignalR OnReconnected event
        /// supports async threading
        /// </summary>
        /// <returns></returns>
       

        /// <summary>
        /// Provides the facility to send individual user notification message
        /// </summary>
        /// <param name="profileId">
        /// Set to the ProfileId of user who will receive the notification
        /// </param>
        /// <param name="message">
        /// set to the notification message
        /// </param>
        public void Send(string profileId, string message)
        {
            //Clients.User(profileId).send(message);
        }

        /// <summary>
        /// Provides the facility to send group notification message
        /// </summary>
        /// <param name="username">
        /// set to the user groupd name who will receive the message
        /// </param>
        /// <param name="message">
        /// set to the notification message
        /// </param>
        public void SendUserMessage(String groupName, String message)
        {
            Clients.Group(groupName).sendUserMessage(message);
        }

        /// <summary>
        /// Provides the ability to get User from the dictionary for passed in profileId
        /// </summary>
        /// <param name="profileId">
        /// set to the profileId of user that need to be fetched from the dictionary
        /// </param>
        /// <returns>
        /// return User object if found otherwise returns null
        /// </returns>
        public User GetUser(string profileId)
        {
            User user;
            Users.TryGetValue(profileId, out user);
            return user;
        }

        /// <summary>
        /// Provide theability to get currently connected user
        /// </summary>
        /// <returns>
        /// profileId of user based on current connectionId
        /// </returns>
        public IEnumerable<string> GetConnectedUser()
        {
            return Users.Where(x =>
            {
                lock (x.Value.ConnectionIds)
                {
                    return !x.Value.ConnectionIds.Contains(Context.ConnectionId, StringComparer.InvariantCultureIgnoreCase);
                }
            }).Select(x => x.Key);
        }

      
        #endregion



        string UserId = string.Empty;
        string WorkGroup = string.Empty;
        string UserIdService = string.Empty;
        string WorkGroupService = string.Empty;


    }


    public class User
    {
        #region Constructor
        public User()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        #endregion


        #region Properties

        /// <summary>
        /// Property to get/set ProfileId
        /// </summary>
        public string ProfileId
        {
            get;
            set;
        }

        /// <summary>
        /// Propoerty to get/set multiple ConnectionId
        /// </summary>
        public HashSet<string> ConnectionIds
        {
            get;
            set;
        }

        #endregion
    }
}