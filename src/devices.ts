import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export type deviceTypes = 'sata' | 'nvme' | 'scsi' | 'ata' | 'raid' | 'all';

export const parseDevicePaths = (stdOut: string) => (
    stdOut.toString().trim().split("\n").map((line: string) => {
        const parts = line.split(" ");
        return parts[0];
    })
);

export interface FetchDeviceList {
    type: deviceTypes;
    fetch: () => Promise<string[]>;
}

export const deviceList: FetchDeviceList[] = [
    {
        type: "sata",
        fetch: async () => {
            const process = await execAsync("smartctl --scan-open | grep '/dev/sd'");
            return parseDevicePaths(process.stdout);
        }
    },
    {
        type: "nvme",
        fetch: async () => {
            const process = await execAsync("smartctl --scan-open | grep '/dev/nvme'");
            return parseDevicePaths(process.stdout);
        }
    },
    {
        type: "scsi",
        fetch: async () => {
            const process = await execAsync("smartctl --scan-open | grep '/dev/sr'");
            return parseDevicePaths(process.stdout);
        }
    },
    {
        type: "ata",
        fetch: async () => {
            const process = await execAsync("smartctl --scan-open | grep '/dev/ata'");
            return parseDevicePaths(process.stdout);
        }
    },
    {
        type: "raid",
        fetch: async () => {
            const process = await execAsync("smartctl --scan-open | grep '/dev/md'");
            return parseDevicePaths(process.stdout);
        }
    },
    {
        type: "all",
        fetch: async () => {
            const process = await execAsync("smartctl --scan-open");
            return parseDevicePaths(process.stdout);
        }
    },
];
