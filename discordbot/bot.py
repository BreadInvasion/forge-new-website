import http.client
import discord, requests as r
from dotenv import dotenv_values
from discord import app_commands

token = dotenv_values(".env")["TOKEN"]
intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)
admins = [600402013271883801, 645456170282123275, 713472590949384253, 705957821820436673, 492027342353596416, 92606254706348032]

@client.event
async def on_ready():
    print("[SYS] Logged in as", client.user.name)
    print("[SYS] Command tree synced.")

@tree.command( name="ping", description="Checks if the bot is online." )
async def ping(inter: discord.Interaction):
    print("[CMD] server ping!")
    await inter.response.send_message("hello!")

@tree.command( name="sync", description="sync command tree")
async def sync(inter: discord.Interaction):
    if inter.user.id not in admins:
        await inter.response.send_message("You are not an admin!")
        return
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
        status_obj = r.get("http://frontend:3000/api/machinestatus", headers={"accept": "application/json"}).json()
        # status_obj = json.loads(json_dat)
        for group in status_obj["groups"]:
            out_str += "## " + group["name"] + "\n"
            for mach in group["machines"]:
                out_str += f"- {mach["name"]} {(":green_circle:" if mach["in_use"] else ":black_circle:") * (not mach["failed"])} {":dizzy_face:" * mach["failed"]} \n"
    except Exception as e:
        out_str += f"```\nERROR: {str(e)}\n```"

    await inter.response.send_message(out_str)

client.run(token)