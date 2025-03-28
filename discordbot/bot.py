import discord, requests as r, pickle, os.path as p
from dotenv import dotenv_values
from discord import app_commands

token = dotenv_values(".env")["TOKEN"]
intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

admins = ""

if p.exists("admins.pkl"):
    admins_pkl = open("admins.pkl", "rb")
    admins = pickle.loads(admins_pkl.read())
    admins_pkl.close()

if len(admins) == 0:
    admins = [int(a) for a in dotenv_values(".env")["DEFAULT_ADMINS"].split(',')]

async def permcheck(inter: discord.Interaction) -> bool:
    if inter.user.id not in admins:
        await inter.response.send_message("This action is not permitted! You are not an admin!")
        return False
    return True

@client.event
async def on_ready():
    print("[SYS] Logged in as", client.user.name)
    print(f"[SYS] Admin users: {", ".join([(await client.fetch_user(a)).name for a in admins])}")

@tree.command( name="ping", description="Checks if the bot is online." )
async def ping(inter: discord.Interaction):
    print("[CMD] server ping!")
    await inter.response.send_message("hello!")

@tree.command( name="sync", description="Sync the bot's command tree with the Discord servers")
async def sync(inter: discord.Interaction):
    if not await permcheck(inter): return
    try:
        await tree.sync(guild=inter.guild)
        await inter.response.send_message("Command tree synced.")
        print("[CMD] Command tree synced.")
    except Exception as e:
        await inter.response.send_message(f"Command tree could not be synced.\nIs the bot present in the current context?\n\nMore details:\n```{e}```")

@tree.command( name="status", description="Checks the status of all machines." )
async def ping(inter: discord.Interaction):
    print("[CMD] machine stats!")
    out_str = "# Machine Usage:\n\n"
    try:
        status_obj = r.get("http://backend:8000/machinestatus", headers={"accept": "application/json"}).json()
        # status_obj = json.loads(json_dat)
        for group in status_obj["groups"]:
            out_str += "## " + group["name"] + "\n"
            for mach in group["machines"]:
                out_str += f"- {mach["name"]} {(":green_circle:" if mach["in_use"] else ":black_circle:") * (not mach["failed"])} {":dizzy_face:" * mach["failed"]} \n"
    except Exception as e:
        out_str += f"```\nERROR: {str(e)}\n```"
    await inter.response.send_message(out_str)

@tree.command( name="add-admin", description="Adds a user as an admin." )
async def add_admin(inter: discord.Interaction, user: discord.User):
    if not await permcheck(inter): return
    try:
        if user.id in admins:
            await inter.response.send_message(f"User {user.display_name} is already an admin.")
            return
        admins.append(user.id)
        
        with open("admins.pkl", "wb") as admins_pkl:
            pickle.dump(admins, admins_pkl)

        await inter.response.send_message(f"Added user {user.display_name} as an admin.")
        print(f"[CMD] Added user {user.display_name} as an admin.")
        print(f"[CMD] Admin users: {", ".join([(await client.fetch_user(a)).name for a in admins])}")
    except Exception as e:
        await inter.response.send_message(f"User {user.display_name} could not be added as an admin because:\n```\n{e}\n```")


@tree.command( name="del-admin", description="Removes an admin's permissions." )
async def del_admin(inter: discord.Interaction, user: discord.User):
    if not await permcheck(inter): return
    try:
        if not user.id in admins:
            await inter.response.send_message(f"User {user.display_name} is not an admin.")
            return
        admins.remove(user.id)
        
        with open("admins.pkl", "wb") as admin_pkl:
            pickle.dump(admins, admin_pkl)

        await inter.response.send_message(f"Removed user {user.display_name} from admin.")
        print(f"[CMD] Removed user {user.display_name} from admin.")
        print(f"[CMD] Admin users: {", ".join([(await client.fetch_user(a)).name for a in admins])}")
    except Exception as e:
        await inter.response.send_message(f"User {user.display_name} could not be removed from admin because:\n```\n{e}\n```")

client.run(token)